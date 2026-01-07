
import { Card } from "./card";

export function CardGrid({cards, onCardClick}){
  return(
    <div className="grid">
      {
        cards.map(card =>(
          <Card key={card.id} card={card} onClick={onCardClick}/>
        ))
      }
    </div>
  );
}