import React, { useEffect, useState } from "react";
import { from, BehaviorSubject } from "rxjs";
import {
  map,
  delay,
  filter,
  mergeMap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";
const style = {};

const getListFromApi = async name => {
  console.log(name);
  const { results } = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=1000"
  ).then(res => res.json());
  var filteredValue = results.filter(data => data.name.includes(name));
  console.log(filteredValue.map(data => data.name));
  return filteredValue;
  //   console.log(
  //     filteredValue.map(row => {
  //       return row.name;
  //     })
  //   );
};

let searchSubject = new BehaviorSubject("");
let searchResultObservable = searchSubject.pipe(
  filter(val => {
    console.log(val);
    return val.length > 1;
  }),
  debounceTime(500),
  distinctUntilChanged(),
  mergeMap(val => from(getListFromApi(val)))
);

const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe(result => {
      setter(result);
      console.log(result);
    });
    return subscription.unsubscribe();
  }, [observable, setter]);
};

const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  useObservable(searchResultObservable, setResult);
  const handleSearchChange = e => {
    const newValue = e.target.value;
    setSearch(newValue);
    searchSubject.next(newValue);
  };
  return (
    <div>
      <input
        type="text"
        //value={search}
        // onChange={handleSearchChange}
        onChange={e => getListFromApi(e.target.value)}
        placeholder={"Search"}
      />
      <div>{JSON.stringify(result)}</div>;
    </div>
  );
};

export default Search;
