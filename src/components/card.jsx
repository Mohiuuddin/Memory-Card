export function Card({card, onClick}){
  return(
    <div className="card" onClick={()=>onClick(card.id)}>
      <img src={card.image} alt={card.title} />
      <h3>{card.title}</h3>
    </div>
  );
}