import './TeamDetails.css';

const TeamDetails = ({teamA, teamB, credit}) => {
    return (
        <div className="details-wrapper">
            <div className="total-players">
                <p>{teamA.count + teamB.count} / 11</p>
                <p>players</p>
            </div>
            <div className="teamA-count">
                <p>{teamA.count}</p>
                <p>{teamA.shortName}</p>
            </div>
            <div className="teamB-count">
                <p>{teamB.count}</p>
                <p>{teamB.shortName}</p>
            </div>
            <div className="credit">
                <p>{credit}</p>
                <p>Cr left</p>
            </div>
        </div>
    )
}

export default TeamDetails;