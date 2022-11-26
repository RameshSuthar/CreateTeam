import PlayerRow from "../PlayerRow/PlayerRow"

const PickedPlayers = ({batsmen, wicketKeepers, allRounders, bowlers}) => {
    const allBatsman = batsmen.map((player) => { if(player.selected) return <PlayerRow key={player.id} player={player} onlyDisplay />});
    const allWicketKeepers = wicketKeepers.map((player) => { if(player.selected) return <PlayerRow key={player.id} player={player} onlyDisplay />});
    const allAllRounders = allRounders.map((player) => { if(player.selected) return <PlayerRow key={player.id} player={player} onlyDisplay />});
    const allBolwers = bowlers.map((player) => { if(player.selected) return <PlayerRow key={player.id} player={player} onlyDisplay />})

    return (
        <div>
            {allBatsman}
            {allWicketKeepers}
            {allAllRounders}
            {allBolwers}
        </div>
    )
}

export default PickedPlayers;