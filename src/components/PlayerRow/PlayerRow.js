import './PlayerRow.css';

const PlayerRow = ({player, onSelect, onlyDisplay}) => {
    return (
        <div className={"player-row-wrapper" + (player.selected && !onlyDisplay ? " selected" : "")}  onClick={() => { if(!onlyDisplay) onSelect(player, player.role, !player.selected)}}>
            <img src={player.team_logo} alt={player.name}></img>
            <p>{player.name}</p>
            <p>9 Credits</p>
        </div>
    )
}

export default PlayerRow;