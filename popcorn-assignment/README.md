# Reading List Application

This application allows you to use the Google Books API to search for a book and then add it to a locally stored reading list.

## Searching

```
  const search = async (query: string) => {
    setLoading(true);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.REACT_APP_GBOOKS_KEY}&maxResults=5`;
    const res = await fetch(url);
    const json = await res.json();
    setResults(json.items ? json.items : []);
    if (!json.items) {
      alert(`No results found for query ${query}!`);
    }
    setLoading(false);
  };
```

The search function works as follows:

1. A search query is provided as a string
2. We set a loading state variable to true to indicate the query is in process
3. We fetch the results from the Google Books API and parse it into a JSON object
4. We set the results state variable to the array of returned "Volumes" from the books API
5. If there is no results we tell the user
6. The loading state variable is returned to false to indicate the query is complete

## The Reading List

### Initial Load

```
useEffect(() => {
    const savedData = localStorage.getItem("readingList");
    const savedReadingList: IVolume[] = savedData ? JSON.parse(savedData) : [];
    setReadingList(savedReadingList);
  }, []);
```

When the app first loads we grab the stored reading list from local storage (if it exists, otherwise return an empty reading list)

### Saving New Items
```
const updateReadingList = (volume: IVolume) => {
    const newReadingList = [...readingList, volume];
    setReadingList(newReadingList);
    localStorage.setItem("readingList", JSON.stringify(newReadingList));
  };
```

When we want to add a new book to the reading list we use the spread operator and the new "Volume" to create the new list, then set the state as well as update local storage.
