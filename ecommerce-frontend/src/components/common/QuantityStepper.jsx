import Icon from './Icon'
import './QuantityStepper.css'

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}) {
  return (
    <div className={`stepper stepper--${size}`}>
      <button
        type="button"
        className="stepper__btn"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="stepper__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="stepper__btn"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  )
}
