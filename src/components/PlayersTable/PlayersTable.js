import PlayerRow from "../PlayerRow/PlayerRow";
import './PlayersTable.css';

const PlayersTable = ({category, data, onSelect}) => {
    
    return (
        <div className="player-wrapper">
            <h2 className="table-title">Pick {category.min} - {category.max} {category.type}</h2>
            <div className="player-list">
                {
                    data.map(player => {
                        return <PlayerRow key={player.name} onSelect={onSelect} player={player}/>
                    })
                }
            </div>
        </div>
    )
}

export default PlayersTable;