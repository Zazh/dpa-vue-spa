import { onMounted } from 'vue';

export function usePageMeta(title, description) {
    onMounted(() => {
        // Устанавливаем title
        document.title = title;

        // Устанавливаем description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
    });
}