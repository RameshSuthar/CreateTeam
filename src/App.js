import { useEffect, useState } from 'react';
import './App.css';
import PlayersTable from './components/PlayersTable/PlayersTable';
import TeamDetails from './components/TeamDetails/TeamDetails';
import PickedPlayers from './components/PickedPlayers/PickedPlayers';

const Categories = [
  {
    type: 'Batsman',
    code: 'Batsman',
    min: 3,
    max: 7
  }, 
  {
    type: 'Wicket Keepers',
    code: 'Wicket-Keeper',
    min: 1,
    max: 5
  }, 
  {
    type: 'All Rounders',
    code: 'All-Rounder',
    min: 0,
    max: 4
  }, 
  {
    type: 'Bowlers',
    code: 'Bowler',
    min: 3,
    max: 7
  }
];

function App() {
  const [playersData, setPlayersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [teamA, setTeamA] = useState({
    name: 'Perth Scorchers',
    shortName: "PS",
    count: 0,
  });
  const [teamB, setTeamB] = useState({
    name: 'Melbourne Stars',
    shortName: "MS",
    count: 0,
  });
  const [credit, setCredit] = useState(100);

  const [batsman, setBatsman] = useState([]);
  const [wicketKeepers, setWicketKeepers] = useState([]);
  const [allRounders, setAllRounders] = useState([]);
  const [bowlers, setBowlers] = useState([]);

  const [proceed, setProceed] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json')
        .then((response) => {
          return response.json();
        }).then((data) => {
          setPlayersData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        })
  }, []);

  useEffect(() => {
    if(playersData) {
      let batsman = [];
      let wicketKeepers = [];
      let allRounders = [];
      let bowlers = [];

      playersData.forEach((player) => {
        let playerData = {...player, selected: false};
        switch(player.role) {
          case 'Batsman':
            batsman.push(playerData);
            break;
          case 'Wicket-Keeper':
            wicketKeepers.push(playerData);
            break;
          case 'All-Rounder':
            allRounders.push(playerData);
            break;
          case 'Bowler':
            bowlers.push(playerData);
            break;      
        }
      });
      setBatsman(batsman);
      setWicketKeepers(wicketKeepers);
      setAllRounders(allRounders);
      setBowlers(bowlers);
    }
  }, [playersData])

  const onSelect = (player, role, select) => {

    //Do validations 
    const res = validateThePlayerSelection(player, role, select);

    if(res?.error) {
      alert(res?.message);
      return;
    }

    //update the player data
    if(role === 'Batsman') {
      if(!checkIfTheRoleCategorySatisfiesTheMaxValue(player, batsman, select)) {
        return;
      }
      let updatedPlayerList = batsman.map((item) => {
        if(item.id === player.id) {
          return {...item, selected: !item.selected}
        } 
        return item;
      })
      setBatsman(updatedPlayerList);

    } else if(role === 'Wicket-Keeper') {
      if(!checkIfTheRoleCategorySatisfiesTheMaxValue(player, wicketKeepers, select)) {
        return;
      }
      let updatedPlayerList = wicketKeepers.map((item) => {
        if(item.id === player.id) {
          return {...item, selected: !item.selected}
        } 
        return item;
      })
      setWicketKeepers(updatedPlayerList);

    } else if(role === 'All-Rounder') {
      if(!checkIfTheRoleCategorySatisfiesTheMaxValue(player, allRounders, select)) {
        return;
      }
      let updatedPlayerList = allRounders.map((item) => {
        if(item.id === player.id) {
          return {...item, selected: !item.selected}
        } 
        return item;
      })
      setAllRounders(updatedPlayerList);

    } else if(role === 'Bowler') {
      if(!checkIfTheRoleCategorySatisfiesTheMaxValue(player, bowlers, select)) {
        return;
      }
      let updatedPlayerList = bowlers.map((item) => {
        if(item.id === player.id) {
          return {...item, selected: !item.selected}
        } 
        return item;
      })
      setBowlers(updatedPlayerList);
    }

     //Update the teamA / teamB count;
     if(player.team_short_name === "PS") {
      let updatedTeamA = {...teamA};
      select ? updatedTeamA.count++ : updatedTeamA.count--;
      setTeamA(updatedTeamA);
    } else {
      let updatedTeamB = {...teamB};
      select ? updatedTeamB.count++ : updatedTeamB.count--;
      setTeamB(updatedTeamB);
    }

    //Update the credit balance;
    setCredit((oldCredit) => {
      if(select) {
        return oldCredit - 9;
      } else {
        return oldCredit + 9;
      }
    })
  }

  const validateThePlayerSelection = (player, role, select) => {
    let res = { error: null, message: null }
    console.log(select)
    if(!select) return res;

    if(teamA.count + teamB.count >= 11) {
      res['error'] = true;
      res['message'] = 'You cannot select more than 11 players.'
      return res;
    }

    if((player.team_short_name === "PS" && teamA.count === 7) || 
      (player.team_short_name === "MS" && teamB.count === 7)) {
        res['error'] = true;
        res['message'] = `You cannot select more than 7 players from ${player.team_name} team.`
        return res;
    }
  }

  const checkIfTheRoleCategorySatisfiesTheMaxValue = (player, playerList, select) => {
    // check if the player from the gievn role category satisfies the max count in that category
    if(!select) {
      return true;
    }
    let selectedPlayersCount = 0;
    let maxValue = 0;
    let minValue = 0;
    let roleName = '';
    Categories.forEach((category) => {
      if(player.role === category.code) {
        maxValue = category.max;
        minValue = category.min;
        roleName = category.type;
      }
    })
    playerList.forEach((item) => {
      if(item.selected) {
        selectedPlayersCount++;
      }
    });
    if(selectedPlayersCount === maxValue) {
      alert(`You cannot select more than ${maxValue} ${roleName}`);
      return false;
    }
    return true;
  }

  const onClickOfProceed = (e) => {
    e.preventDefault();
    const res = onProceedValidation();
    if(res.error) {
      alert(res.message);
      return;
    }
    setProceed(true);
  }

  const onProceedValidation = () => {
    // check if the category min/max satisfies.
    const res = { error: null, message: null }; 
    let batsmanCount = 0;
    let wicketKeepersCount = 0;
    let allRoundersCount = 0;
    let bowlersCount = 0;

    if(teamA.count + teamB.count < 11) {
      res['error'] = true;
      res['message'] = `Please select 11 players!!`;
      return res;
    }

    batsman.forEach((player) => { if(player.selected) batsmanCount++;})
    wicketKeepers.forEach((player) => { if(player.selected) wicketKeepersCount++;})
    allRounders.forEach((player) => { if(player.selected) allRoundersCount++;})
    bowlers.forEach((player) => { if(player.selected) bowlersCount++;})

    console.log(batsmanCount, wicketKeepersCount, allRoundersCount, bowlersCount);

    for(let i = 0; i < Categories.length; i++) {
      if((Categories[i].code === "Batsman" && !(Categories[i].min <= batsmanCount && batsmanCount <= Categories[i].max)) ||
      (Categories[i].code === "Wicket-Keeper" && !(Categories[i].min <= wicketKeepersCount && wicketKeepersCount <= Categories[i].max)) || 
      (Categories[i].code === "All-Rounder" && !(Categories[i].min <= allRoundersCount && allRoundersCount <= Categories[i].max)) || 
      (Categories[i].code === "Bowler" && !(Categories[i].min <= bowlersCount && bowlersCount <= Categories[i].max))) {
        res['error'] = true;
        res['message'] = `${Categories[i].type} count should be in the range of ${Categories[i].min} - ${Categories[i].max}`;
        return res;
      }
    }
    return res;
  }

  const categoryData = Categories.map((category) => {
    if(category.type === "Batsman") {
      return <PlayersTable onSelect={onSelect} key={category.code} category={category} data={batsman}/>
    } else if(category.type === "Wicket Keepers") {
      return <PlayersTable onSelect={onSelect} key={category.code} category={category} data={wicketKeepers}/>
    } else if(category.type === "All Rounders") {
      return <PlayersTable onSelect={onSelect} key={category.code} category={category} data={allRounders}/>
    } else {
      return <PlayersTable onSelect={onSelect} key={category.code} category={category} data={bowlers}/>
    }
  })

  return (
    <div className="App">
        <header>
          <div className='title'>
            <p>{proceed ? 'Picked Players' : 'Pick Players'}</p>
          </div>
          {
            proceed ? 
            <div style={{cursor: 'pointer'}} onClick={() => setProceed((oldVal) => !oldVal)}>Go Back</div> :
            <TeamDetails teamA={teamA} teamB={teamB} credit={credit}/>
          }
        </header> 

        {!loading ? 
          <section className={'players-app' +  (proceed ? " make-center" : "")}>
            {playersData && !proceed ?
              categoryData : 
              <PickedPlayers batsmen={batsman} wicketKeepers={wicketKeepers} allRounders={allRounders} bowlers={bowlers}/>
            }
          </section>
            : 
          <section>
            <center>Fetching Players Data...</center>
          </section>
        }

        {error && 'error'}

        { !proceed &&
          <footer>
            <button onClick={onClickOfProceed}>{loading ? 'loading...' : 'Proceed'}</button>
          </footer>
        }
    </div>
  );
}

export default App;
