import React, { useEffect, useState } from "react";
import withStyles from "react-jss";
import { from, BehaviorSubject } from "rxjs";
import {
  map,
  filter,
  mergeMap,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from "rxjs/operators";
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
  // console.log(filteredValue.map(data => data.name));
  console.log("api", name);
  if (filteredValue) return filteredValue;
  else return [];
  //   console.log(
  //     filteredValue.map(row => {
  //       return row.name;
  //     })
  //   );
};

let searchSubject = new BehaviorSubject("");
let searchResultObservable = searchSubject.pipe(
  // filter(val => {
  //   console.log("inside observable", val);
  //   return val.length > 1;
  // }),
  // debounceTime(500),
  // distinctUntilChanged(),
  // switchMap(val => {
  //   console.log("inside mergeMap", val);
  //   getListFromApi(val));
  // })
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
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder={"Search"}
      />
      {result.map(data => (
        <div className={displayFlag ? classes.display : classes.hidden}>
          {data.name}
        </div>
      ))}
    </div>
  );
};

export default withStyles(style)(Search);
