export function ScoreBoard({current, best}){
  return(
    <div className="scoreBoard">
      <h3>PokéMemory</h3>
      <p>Score: {current} | Best Score: {best}</p>
    </div>
  );
}