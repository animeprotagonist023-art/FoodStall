import { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import type { CartItem, Dish, Restaurant } from '../types';
import { money } from '../lib';
import { useFoodStall } from '../store';
import { DishImage, Modal, QuantityControl } from './common';

interface Props {
  restaurant: Restaurant;
  dish: Dish;
  onClose: () => void;
  onSubmit: (item: CartItem, oldId?: string) => void;
  editing?: CartItem;
}

export default function DishCustomizer({ restaurant, dish, onClose, onSubmit, editing }: Props) {
  const [choice, setChoice] = useState(() => {
    const match = dish.requiredOptions?.options.find((option) => editing?.options.includes(option.name));
    return match?.id ?? dish.requiredOptions?.options[0]?.id ?? '';
  });
  const [extras, setExtras] = useState<string[]>(() => dish.extras?.filter((extra) => editing?.options.includes(extra.name)).map((extra) => extra.id) ?? []);
  const [quantity, setQuantity] = useState(editing?.quantity ?? 1);
  const [instructions, setInstructions] = useState(editing?.instructions ?? '');
  const [validation, setValidation] = useState('');
  const { cart } = useFoodStall();

  const selectedChoice = dish.requiredOptions?.options.find((option) => option.id === choice);
  const selectedExtras = dish.extras?.filter((extra) => extras.includes(extra.id)) ?? [];
  const optionCost = (selectedChoice?.price ?? 0) + selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = dish.price + optionCost;
  const total = unitPrice * quantity;
  const currentRestaurantInCart = cart[0]?.restaurantId;

  const toggleExtra = (id: string) => setExtras((current) => current.includes(id) ? current.filter((extra) => extra !== id) : [...current, id]);
  const finalItem = useMemo(() => {
    const optionNames = [...(selectedChoice ? [selectedChoice.name] : []), ...selectedExtras.map((extra) => extra.name)];
    const cleanInstructions = instructions.trim();
    const newId = editing?.id ?? `${dish.id}-${[choice, ...[...extras].sort()].filter(Boolean).join('-')}-${encodeURIComponent(cleanInstructions).slice(0, 18)}`;
    return {
      id: newId,
      restaurantId: restaurant.id,
      dishId: dish.id,
      name: dish.name,
      basePrice: dish.price,
      quantity,
      image: dish.image,
      options: optionNames,
      optionCost,
      instructions: cleanInstructions,
    } satisfies CartItem;
  }, [choice, dish, editing, extras, instructions, optionCost, quantity, restaurant.id, selectedChoice, selectedExtras]);

  const submit = () => {
    if (dish.requiredOptions && !choice) { setValidation(`Please ${dish.requiredOptions.label.toLowerCase()}.`); return; }
    if (currentRestaurantInCart && currentRestaurantInCart !== restaurant.id && !editing) { onSubmit(finalItem); return; }
    onSubmit(finalItem, editing?.id);
  };

  return <Modal title={editing ? 'Make it just right' : 'Make it your own'} onClose={onClose} className="customizer-modal">
    <div className="customizer-body">
      <div className="customizer-dish-intro"><DishImage src={dish.image} alt={dish.name} className="customizer-image" /><div><h3>{dish.name}</h3><p>{dish.description}</p><strong>{money(dish.price)}</strong></div></div>
      {dish.requiredOptions && <section className="customizer-section"><div className="option-heading"><div><h3>{dish.requiredOptions.label}</h3><p>Pick one to continue</p></div><span className="required-tag">REQUIRED</span></div><div className="option-list">{dish.requiredOptions.options.map((option) => <label key={option.id} className={`option-row ${choice === option.id ? 'option-selected' : ''}`}><input type="radio" name={`choice-${dish.id}`} checked={choice === option.id} onChange={() => { setChoice(option.id); setValidation(''); }} /><span className="custom-radio" /><span className="option-name">{option.name}</span><span className="option-price">{option.price ? `+${money(option.price)}` : 'Included'}</span></label>)}</div></section>}
      {!!dish.extras?.length && <section className="customizer-section"><div className="option-heading"><div><h3>Make it extra</h3><p>Optional add-ons</p></div><span className="optional-tag">OPTIONAL</span></div><div className="option-list">{dish.extras.map((extra) => <label key={extra.id} className={`option-row ${extras.includes(extra.id) ? 'option-selected' : ''}`}><input type="checkbox" checked={extras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} /><span className="custom-checkbox">{extras.includes(extra.id) ? '✓' : ''}</span><span className="option-name">{extra.name}</span><span className="option-price">+{money(extra.price)}</span></label>)}</div></section>}
      <section className="customizer-section instructions-section"><label htmlFor="dish-instructions">Anything we should know? <span>(optional)</span></label><textarea id="dish-instructions" value={instructions} maxLength={180} onChange={(event) => setInstructions(event.target.value)} placeholder="No onions, sauce on the side..." rows={2} /></section>
      {validation && <p className="form-error" role="alert">{validation}</p>}
      <div className="customizer-sticky-footer"><QuantityControl quantity={quantity} onChange={setQuantity} label={`Quantity of ${dish.name}`} /><button className="button button-primary add-to-bag-button" onClick={submit}><span>{editing ? 'Save changes' : 'Add to bag'}</span><span>{money(total)}</span><ShoppingBag size={17} /></button></div>
      {currentRestaurantInCart && currentRestaurantInCart !== restaurant.id && !editing && <p className="tiny-note cart-switch-note">Your bag currently belongs to a different restaurant. You’ll be asked before it is replaced.</p>}
    </div>
  </Modal>;
}
