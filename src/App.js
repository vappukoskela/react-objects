import './App.css';
import { useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

function App() {
//------- SET UP --------------------------------------------------------------
  const nameArray = ["Olivia",
    "Emily",
    "Isla",
    "Sophie",
    "Ella",
    "Ava",
    "Amelia",
    "Grace",
    "Freya",
    "Charlotte",
    "Jack",
    "Oliver",
    "James",
    "Charlie",
    "Harris",
    "Lewis",
    "Leo",
    "Noah",
    "Alfie",
    "Rory"]

  const surnameArray =[
    "SMITH",
    "MARSHALL",
    "BROWN",
    "STEVENSON",
    "WILSON",
    "WOOD",
    "THOMSON",
    "SUTHERLAND",
    "ROBERTSON",
    "CRAIG",
    "CAMPBELL",
    "WRIGHT",
    "STEWART",
    "MCKENZIE",
    "ANDERSON",
    "KENNEDY",
    "MACDONALD",
    "JONES",
    "SCOTT",
    "BURNS"
  ]

  // Set up the array of objects, dynamically just for fun
  const createObject =() => {
    var ageArray = Array.from({length: 20}, () => Math.floor(Math.random() * 40));
    var newArray = [];
    for(var i = 0; i< nameArray.length ; i++){
      var lineObject = {}
      lineObject.id = i;
      lineObject.firstName = nameArray[i];
      lineObject.lastName = capitaliseFirstLetter(surnameArray[i]);
      lineObject.age = ageArray[i]
      newArray = newArray.concat(lineObject);
    }
    return newArray;
  }
  // why format your copypaste data by hand?
  function capitaliseFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [originalRows] = useState(createObject());
  const [namesLeft, setNamesLeft] = useState(originalRows.slice(0, originalRows.length/2));
  const [namesRight, setNamesRight] = useState(originalRows.slice(namesLeft.length));
  
  const [selectedNames, setSelectedNames] = useState([]);
  const [filteredLeft, setFilteredLeft] = useState([...namesLeft]);
  const [filteredRight, setFilteredRight] = useState([...namesRight]);
  
//-------------------------------------------------------------------

const constructList = (array, isLeftTable) => {
  if (array.length === 0){
    return "This list is empty";
  } else {
    return (
      <div>
        <div className="divTable minimalistBlack">
          <div className="divTableHeading">
            <div className="divTableRow">
            <div className="divTableCell" onClick={() => selectAllNames(isLeftTable)}><Checkbox hidden={true}/></div>
            <div className="divTableCell" onClick= {() => sortListBy("firstName", isLeftTable)}>First name <ArrowDropDownIcon fontSize="small"/></div>
            <div className="divTableCell" onClick= {() => sortListBy("lastName", isLeftTable)}>Surname <ArrowDropDownIcon fontSize="small"/></div>
            <div className="divTableCell" onClick= {() => sortListBy("age", isLeftTable)}>Age <ArrowDropDownIcon fontSize="small"/></div>
            </div>
          </div>
        
        {array.map((value) => {
          return (
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell" onClick={() => nameSelect(value)}><Checkbox checked={selectedNames.indexOf(value) !== -1} hidden={true}/></div>
              <div className="divTableCell" >{value.firstName}</div>
              <div className="divTableCell" >{value.lastName}</div>
              <div className="divTableCell" >{value.age}</div>
            </div>
          </div>
          )
        })}
        </div>
      </div>
    );
  }
}

// search function
const filterLeft = (event) => {
  var filteredLeftArr= []
  var searchVal = event.target.value;

  for(var i = 0; i < namesLeft.length; i++){
    var thisAge = '' + namesLeft[i].age;
    if(thisAge === searchVal){
      filteredLeftArr.push(namesLeft[i]);
    }
  }
  if( filteredLeftArr.length > 0){
    setFilteredLeft(filteredLeftArr);
  } else if (searchVal !== '') {
    setFilteredLeft([]);
  } else { setFilteredLeft(namesLeft)}
}
const filterRight = (event) => {
  var filteredRightArr= []
  var searchVal = event.target.value;

  for(var i = 0; i < namesRight.length; i++){
    var thisAge = '' + namesRight[i].age;
    if(thisAge === searchVal){
      filteredRightArr.push(namesRight[i]);
    }
  }
  if( filteredRightArr.length > 0){
    setFilteredLeft(filteredRightArr);
  } else if (searchVal !== '') {
    setFilteredLeft([]);
  } else { setFilteredLeft(namesLeft)}}

const selectAllNames = (isLeftTable) => {
  if (isLeftTable){
    setSelectedNames(selectedNames.concat(filteredLeft.filter(name => !selectedNames.includes(name))));
  } else {
    setSelectedNames(selectedNames.concat(filteredRight.filter(name => !selectedNames.includes(name))));
  }
} 

// sort function
const sortListBy = (column, isLeftTable) => {
  var array = []
  if(isLeftTable){
    array = [...namesLeft]
  } else {
    array = [...namesRight]
  }
  switch (column) {
    case "firstName":
      array.sort((a, b) => {
        if(a.firstName > b.firstName) { return 1; }
        else { return -1;} 
        });
      break;
    case "lastName":
      array.sort((a, b) => {
        if(a.lastName > b.lastName) { return 1; }
        else { return -1;} 
        });
        break;
    case "age":
      array.sort((a, b) => {
        if(a.age > b.age) { return 1; }
        else { return -1;} 
        });
        break;
    default:
      break;
  }
  if (isLeftTable){
    updateListStatus(array, namesRight);
  } else {
    updateListStatus(namesLeft, array);
  }

}

const nameSelect = (name) => {
  const newSelectNames = [...selectedNames];
  const nameIndexInArray = selectedNames.indexOf(name);
  if (nameIndexInArray !== -1){
    newSelectNames.splice(nameIndexInArray,1); // unselect
  } else {
    newSelectNames.push(name); // add to selectionarray
  }
  console.log(newSelectNames)
  setSelectedNames(newSelectNames);
}

const moveToRight = () => {
  // filter away the names being moved from the left
  const newLeftNames = namesLeft.filter(row => !selectedNames.includes(row));

  // filter away names that are already on the right so not to duplicate
  const filteredSelectedNames = selectedNames.filter(row => !namesRight.includes(row));
  const newRightNames = namesRight.concat(originalRows.filter(val => filteredSelectedNames.includes(val)));

  updateListStatus(newLeftNames, newRightNames);
  setSelectedNames([]);
}


const moveToLeft = () => {
  // filter away the names being moved from the right
  const newRightNames = namesRight.filter(row => !selectedNames.includes(row));

  // filter away names that are already on the left so not to duplicate
  const filteredSelectedNames = selectedNames.filter(row => !namesLeft.includes(row));
  const newLeftNames = namesLeft.concat(originalRows.filter(val => filteredSelectedNames.includes(val)));;
  updateListStatus(newLeftNames, newRightNames);
  setSelectedNames([]);
}

const updateListStatus = (newLeftNames, newRightNames) => {
  // update arrays maintaining all values in each list
  setNamesLeft(newLeftNames);
  setNamesRight(newRightNames);

  // update arrays used in search to reset the search
  setFilteredLeft(newLeftNames);
  setFilteredRight(newRightNames);
}

const swapNames = () => {
  // remaining names: select all except those that have been selected
  const remainingNamesOnRight = namesRight.filter(name => !selectedNames.includes(name));
  // this is the names from the right to be moved to the left
  const filteredSelectedNamesToLeft = selectedNames.filter(name => !namesLeft.includes(name));
  
  // vice versa
  const remainingNamesOnLeft = namesLeft.filter(name => !selectedNames.includes(name));
  const filteredSelectedNamesToRight = selectedNames.filter(name => !namesRight.includes(name));

  // concatenate the stripped old list and newcomers from the other list
  const newLeftNames = remainingNamesOnLeft.concat(originalRows.filter(val => filteredSelectedNamesToLeft.includes(val)));;
  const newRightNames = remainingNamesOnRight.concat(originalRows.filter(val => filteredSelectedNamesToRight.includes(val)));

  // update all values 
  updateListStatus(newLeftNames, newRightNames);
  // reset checked
  setSelectedNames([]);
}

return (
  <div>
    <div className="listsContainer">
      <div className="topButtons" >
          <button className="topButton"onClick={() => moveToRight()}>{">>>"}</button>
          <button className="topButton"onClick={() => moveToLeft()}>{"<<<"}</button>
          <button className="topButton"onClick={() => swapNames()}>SWAP</button>
      </div>
      <div className="listL">
        <div className="sortTitle">
          <div className="searchBox"><input type="text"  placeholder="Search" onChange={(e) => filterLeft(e)}></input></div>
            <div className="buttons">
            </div>
          </div>
          {constructList(filteredLeft, true)}
        </div> 
        <div className="listR">
          <div className="sortTitle">
            <div className="searchBox"><input type="text" placeholder="Search" onChange={(e) => filterRight(e)}></input></div>
            <div className="buttons">
            </div>
          </div>
          {constructList(filteredRight, false)}
        </div>
      </div>
    </div>
);
}

export default App;