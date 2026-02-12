import { ref, computed, watch, onUnmounted } from 'vue'

export function useExamCountdown(examSchedule, refetchCanAttempt) {
    const now = ref(Date.now())
    let intervalId = null
    let hasRefetched = false

    const startTs = computed(() => {
        const s = examSchedule.value
        if (!s?.date || !s?.start_time) return null
        return new Date(`${s.date}T${s.start_time}:00`).getTime()
    })

    const endTs = computed(() => {
        const s = examSchedule.value
        if (!s?.date || !s?.end_time) return null
        return new Date(`${s.date}T${s.end_time}:00`).getTime()
    })

    const status = computed(() => {
        if (!startTs.value || !endTs.value) return 'no_schedule'
        const current = now.value
        if (current >= endTs.value) return 'expired'
        if (current >= startTs.value) return 'active'
        if (startTs.value - current <= 86400000) return 'countdown' // ≤ 1 день
        return 'future'
    })

    const isAvailable = computed(() => status.value === 'active')

    // Обратный отсчёт до начала
    const countdown = computed(() => {
        if (status.value !== 'countdown') return null
        const diff = Math.max(0, Math.floor((startTs.value - now.value) / 1000))
        const h = Math.floor(diff / 3600)
        const m = Math.floor((diff % 3600) / 60)
        const s = diff % 60
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    })

    // Оставшееся время до закрытия
    const timeLeft = computed(() => {
        if (status.value !== 'active') return null
        return `${Math.ceil((endTs.value - now.value) / 60000)} мин`
    })

    // Текст для отображения даты (future)
    const scheduleDateText = computed(() => {
        const s = examSchedule.value
        if (!s || status.value !== 'future') return null
        const date = new Date(s.date + 'T00:00:00')
        const formatted = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
        return `${formatted}, ${s.start_time} – ${s.end_time}`
    })

    function startTicker() {
        stopTicker()
        hasRefetched = false
        intervalId = setInterval(() => {
            now.value = Date.now()
            if (status.value === 'active' && !hasRefetched) {
                hasRefetched = true
                refetchCanAttempt?.()
            }
            if (status.value === 'expired') stopTicker()
        }, 1000)
    }

    function stopTicker() {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    watch(examSchedule, (val) => {
        if (val) { now.value = Date.now(); hasRefetched = false; startTicker() }
        else stopTicker()
    }, { immediate: true })

    onUnmounted(stopTicker)

    return { status, countdown, isAvailable, timeLeft, scheduleDateText }
}