import React, { useEffect, useState } from "react";
import withStyles from "react-jss";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
const style = {
  hidden: {
    display: "none"
  }
};

const getListFromApi = async name => {
  console.log("api", name);
  const { results } = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=1000"
  ).then(res => res.json());
  var filteredValue = results.filter(data => data.name.includes(name));
  console.log("api", name);
  if (filteredValue) return filteredValue;
  else return [];
};

let searchSubject = new BehaviorSubject("");
let searchResultObservable = searchSubject.pipe(
  debounceTime(500),
  distinctUntilChanged(),
  switchMap(val => getListFromApi(val))
);

var displayFlag = 0;

const Search = ({ classes }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  useEffect(() => {
    searchResultObservable.subscribe(result => {
      setResult(result);
    });
  }, [search]);

  const handleSearchChange = e => {
    displayFlag = 1;
    const newValue = e.target.value;
    newValue.length > 0 ? (displayFlag = 1) : (displayFlag = 0);
    setSearch(newValue);
    searchSubject.next(newValue);
  };
  return (
    <div>
      <h1>Search for your favourite pokemon</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder={"Search"}
      />
      {result.map((data, i) => (
        <div key={i} className={displayFlag ? classes.display : classes.hidden}>
          {data.name}
        </div>
      ))}
    </div>
  );
};

export default withStyles(style)(Search);
