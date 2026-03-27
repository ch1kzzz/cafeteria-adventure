import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { WheelOfFortuneProps } from '@/types'
import { easeOutCubic } from '@/utils/animation'
import './WheelOfFortune.css'

export interface WheelOfFortuneRef {
  spin: (targetIndex: number) => void
  reset: () => void
  isSpinning: boolean
}

export const WheelOfFortune = forwardRef<WheelOfFortuneRef, WheelOfFortuneProps>(
  ({ options, size = 350, onSpinEnd, className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<{ rafId: number | null; startTime: number | null }>({
      rafId: null,
      startTime: null,
    })
    const isSpinningRef = useRef(false)
    const currentAngleRef = useRef(0)

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      spin: (targetIndex: number) => {
        if (isSpinningRef.current || options.length === 0) return
        spinTo(targetIndex)
      },
      reset: () => {
        if (animationRef.current.rafId !== null) {
          cancelAnimationFrame(animationRef.current.rafId)
        }
        currentAngleRef.current = 0
        isSpinningRef.current = false
        drawWheel(0)
      },
      get isSpinning() {
        return isSpinningRef.current
      },
    }))

    // 绘制转盘
    const drawWheel = (rotation: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 处理高 DPI 屏幕
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const radius = Math.min(centerX, centerY) - 10

      // 清空画布
      ctx.clearRect(0, 0, rect.width, rect.height)

      if (options.length === 0) {
        // 空状态
        ctx.fillStyle = '#E0E0E0'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#999'
        ctx.font = '16px -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('请先添加食物选项', centerX, centerY)
        return
      }

      const sectorAngle = (Math.PI * 2) / options.length

      // 绘制扇区
      options.forEach((option, index) => {
        const startAngle = rotation + index * sectorAngle - Math.PI / 2
        const endAngle = startAngle + sectorAngle

        // 扇区背景
        ctx.fillStyle = option.color
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fill()

        // 扇区边框
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()

        // 绘制文字
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(startAngle + sectorAngle / 2)

        // 固定位置：图标在内圈，文字在外圈
        const emojiRadius = radius * 0.3
        const textRadius = radius * 0.8
        const maxTextWidth = radius * 0.35

        // 绘制表情符号（固定位置）
        if (option.emoji) {
          ctx.font = '20px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(option.emoji, emojiRadius, 0)
        }

        // 绘制食物名称（固定位置，右对齐）
        ctx.fillStyle = getContrastColor(option.color)
        ctx.font = 'bold 14px -apple-system, sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'

        let displayText = option.name
        if (ctx.measureText(displayText).width > maxTextWidth) {
          while (
            ctx.measureText(displayText + '…').width > maxTextWidth &&
            displayText.length > 1
          ) {
            displayText = displayText.slice(0, -1)
          }
          displayText += '…'
        }

        ctx.fillText(displayText, textRadius, 0)

        ctx.restore()
      })

      // 绘制中心圆
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FF6B6B'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.12, 0, Math.PI * 2)
      ctx.fill()

      // 绘制中心文字
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 12px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('GO', centerX, centerY)
    }

    // 获取对比色
    const getContrastColor = (hexColor: string): string => {
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#000000' : '#FFFFFF'
    }

    // 从角度计算对应的索引（用于调试和验证）
    const getIndexFromAngle = (rotation: number): number => {
      if (options.length === 0) return 0

      const sectorAngle = 360 / options.length
      // 标准化旋转角度到 0-360
      const normalizedRotation = ((rotation % 360) + 360) % 360

      // 指针固定在顶部 270°
      // 扇区 i 的范围: [rotation + i * sectorAngle - 90, rotation + (i+1) * sectorAngle - 90]
      // 需要找到 i 使得: rotation + i * sectorAngle - 90 <= 270 < rotation + (i+1) * sectorAngle - 90
      // 简化: i * sectorAngle <= 360 - rotation < (i+1) * sectorAngle
      // i = floor((360 - rotation) / sectorAngle)

      const angleFromZero = (360 - normalizedRotation) % 360
      const index = Math.floor(angleFromZero / sectorAngle) % options.length

      return index
    }

    // 旋转到指定索引
    const spinTo = (targetIndex: number) => {
      isSpinningRef.current = true

      const sectorAngle = 360 / options.length

      // 目标：让 targetIndex 扇区的中心对准顶部（270°）
      // 根据 getIndexFromAngle: index = floor((360 - rotation) / sectorAngle)
      // 要让 index = targetIndex，需要: targetIndex * sectorAngle <= 360 - rotation < (targetIndex + 1) * sectorAngle
      // 扇区中心: 360 - rotation = targetIndex * sectorAngle + sectorAngle / 2
      // 所以: rotation = 360 - targetIndex * sectorAngle - sectorAngle / 2

      const targetRotation = 360 - targetIndex * sectorAngle - sectorAngle / 2

      // 额外旋转3圈
      const extraSpins = 3
      const totalRotation = extraSpins * 360 + targetRotation

      // 加上当前角度，保持连续旋转
      const startAngle = currentAngleRef.current
      const finalAngle = startAngle + totalRotation - (startAngle % 360)

      // 验证计算是否正确
      const verifyIndex = getIndexFromAngle(finalAngle)
      console.log(
        '目标索引:',
        targetIndex,
        '验证索引:',
        verifyIndex,
        '最终角度:',
        finalAngle,
        '目标旋转:',
        targetRotation
      )

      const duration = 3000 // 3秒
      animationRef.current.startTime = performance.now()

      const animate = () => {
        const currentTime = performance.now()
        const elapsed = currentTime - (animationRef.current.startTime || 0)
        const progress = Math.min(elapsed / duration, 1)

        // 使用缓动函数
        const easedProgress = easeOutCubic(progress)
        const currentAngle = startAngle + (finalAngle - startAngle) * easedProgress

        currentAngleRef.current = currentAngle
        drawWheel((currentAngle * Math.PI) / 180)

        if (progress < 1) {
          animationRef.current.rafId = requestAnimationFrame(animate)
        } else {
          isSpinningRef.current = false
          // 最终验证
          const finalCheckIndex = getIndexFromAngle(finalAngle)
          console.log('最终验证索引:', finalCheckIndex)
          if (onSpinEnd) {
            onSpinEnd(options[finalCheckIndex])
          }
        }
      }

      animationRef.current.rafId = requestAnimationFrame(animate)
    }

    // 初始绘制
    useEffect(() => {
      drawWheel(0)
    }, [options])

    // 窗口大小变化时重绘
    useEffect(() => {
      const handleResize = () => {
        drawWheel((currentAngleRef.current * Math.PI) / 180)
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [options])

    return (
      <div className={`wheel-of-fortune ${className}`} style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          className="wheel-canvas"
          style={{ width: '100%', height: '100%' }}
          role="img"
          aria-label="食物转盘"
        />
        <div className="wheel-pointer" aria-hidden="true" />
      </div>
    )
  }
)

WheelOfFortune.displayName = 'WheelOfFortune'
