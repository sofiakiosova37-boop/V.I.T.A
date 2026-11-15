export interface SingleTestProps {
  /** Останній збережений результат (щоб показати користувачу, якщо він вже проходив тест) */
  savedResult?: number;
  /** Функція, яку розробник тесту викликає в кінці, щоб передати фінальне число в систему */
  onSaveResult: (value: number) => void;
  /** for backend identification */
  userId?: number;
}