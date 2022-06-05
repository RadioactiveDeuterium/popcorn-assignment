import React, { useState, useEffect } from "react";
import "./App.css";

//Interface for the volumeInfo object from the Google Books API - Objects we will not be using have been left as any
interface IVolumeInfo {
  allowAnonLogging: boolean;
  authors: string[];
  cannonicalVolumeLink: string;
  categories: string[];
  contentVersion: string;
  description: string;
  imageLinks: any;
  industryIdentifiers: any[];
  infoLink: string;
  language: string;
  maturityRating: string;
  pageCount: number;
  panelizationSummary: any;
  previewLink: string;
  printType: string;
  publishedDate: string;
  publisher: string;
  readingModes: any;
  subtitle: string;
  title: string;
}

//Interface for the volume object from the Google Books API - Objects we will not be using have been left as any
interface IVolume {
  accessInfo: any;
  etag: string;
  id: string;
  kind: string;
  saleInfo: any;
  searchInfo: any;
  selfLink: string;
  volumeInfo: IVolumeInfo;
}

function App() {
  const [loading, setLoading] = useState(false); //Implicitly defined as a boolean
  const [query, setQuery] = useState(""); //Implicitly defined as a string
  const [results, setResults] = useState<IVolume[]>([]);
  const [readingList, setReadingList] = useState<IVolume[]>([]);

  // Get the saved reading list from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem("readingList");
    const savedReadingList: IVolume[] = savedData ? JSON.parse(savedData) : [];
    setReadingList(savedReadingList);
  }, []);

  // Add a new volume object to the reading list and save to localStorage
  const updateReadingList = (volume: IVolume) => {
    const newReadingList = [...readingList, volume];
    setReadingList(newReadingList);
    localStorage.setItem("readingList", JSON.stringify(newReadingList));
  };

  // Search box input change handler
  const onSearchInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newQuery = e.currentTarget.value;
    setQuery(newQuery);
  };

  //Query the Google Books API for the current search query
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

  return (
    <div className="App">
      {/* Header */}
      <h3 className="text-xl my-4">My Reading List</h3>
      {/* Search Box */}
      <div className="flex mx-auto w-fit">
        <p className="mr-1">Search Querry:</p>
        <input
          className="border border-solid mx-1"
          onChange={onSearchInputChange}
        />
        <button
          className="bg-slate-200 px-2 py-px rounded ml-1"
          onClick={() => search(query)}>
          Search
        </button>
      </div>
      {/* Search Results Table */}
      {results.length > 0 || loading ? (
        <>
          {loading ? (
            <div className="text-xl my-4">Loading...</div>
          ) : (
            <>
              <h5 className="text-xl my-4">Search Results</h5>
              <table className="table-auto w-fit mx-auto mt-8">
                <tr>
                  <th>Author</th>
                  <th>Title</th>
                  <th>Publisher</th>
                </tr>
                {results.map((result: IVolume) => (
                  <tr key={result.id}>
                    <td>{result.volumeInfo.authors?.join(", ") || "-"}</td>
                    <td>{result.volumeInfo.title || "-"}</td>
                    <td>{result.volumeInfo.publisher || "-"}</td>
                    <td>
                      <button
                        onClick={() => updateReadingList(result)}
                        className="bg-slate-200 px-2 py-px rounded ml-1">
                        Add To List
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            </>
          )}
        </>
      ) : null}
      {/* Reading List */}
      {readingList.length > 0 ? (
        <>
          <h5 className="text-xl my-4">Reading List</h5>
          <table className="table-auto w-fit mx-auto mt-8">
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th>Publisher</th>
            </tr>
            {readingList.map((item: IVolume) => (
              <tr key={item.id}>
                <td>{item.volumeInfo.authors?.join(", ") || "-"}</td>
                <td>{item.volumeInfo.title || "-"}</td>
                <td>{item.volumeInfo.publisher || "-"}</td>
              </tr>
            ))}
          </table>
        </>
      ) : null}
    </div>
  );
}

export default App;
