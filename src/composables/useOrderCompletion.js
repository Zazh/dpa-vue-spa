import { paymentsAPI } from '@/services/api.js';

export function useOrderCompletion() {

    /**
     * Проверяет наличие оплаченного заказа и завершает его.
     * Вызывается ПОСЛЕ успешной авторизации.
     */
    const checkAndCompleteOrder = async () => {
        const orderToken = localStorage.getItem('payment_order_token');

        if (!orderToken) {
            return { hasOrder: false };
        }

        try {
            const response = await paymentsAPI.completeOrder(orderToken);

            // Очищаем токен
            localStorage.removeItem('payment_order_token');

            return {
                hasOrder: true,
                success: true,
                courseName: response.data.course_name,
                message: response.data.message
            };

        } catch (err) {
            console.error('Ошибка завершения заказа:', err);
            localStorage.removeItem('payment_order_token');

            return {
                hasOrder: true,
                success: false,
                error: err.response?.data?.error || 'Ошибка при зачислении на курс'
            };
        }
    };

    /**
     * Получает данные заказа для предзаполнения формы.
     */
    const getOrderData = async () => {
        const orderToken = localStorage.getItem('payment_order_token');

        if (!orderToken) {
            return null;
        }

        try {
            const response = await paymentsAPI.getOrderInfo(orderToken);
            return response.data;
        } catch (err) {
            console.error('Ошибка получения данных заказа:', err);
            return null;
        }
    };

    /**
     * Проверяет есть ли активный заказ.
     */
    const hasActiveOrder = () => {
        return !!localStorage.getItem('payment_order_token');
    };

    /**
     * Сохраняет токен заказа.
     */
    const setOrderToken = (token) => {
        localStorage.setItem('payment_order_token', token);
    };

    /**
     * Очищает токен заказа.
     */
    const clearOrderToken = () => {
        localStorage.removeItem('payment_order_token');
    };

    return {
        checkAndCompleteOrder,
        getOrderData,
        hasActiveOrder,
        setOrderToken,
        clearOrderToken
    };
}