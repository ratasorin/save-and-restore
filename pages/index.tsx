import { FC, useEffect, useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Record, State } from "../shared";
import { addRecord, updateRecords } from "../src/slices/records.slice";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";

interface RecordsSSR {
  recordsDB: Record[];
}

const Home: FC<RecordsSSR> = ({ recordsDB }) => {
  const { index, records } = useAppSelector(({ records }) => records);
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(
    recordsDB[recordsDB.length - 1].state.color
  );
  const [title, setTitle] = useState(
    recordsDB[recordsDB.length - 1].state.title
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log({ recordsDB });
    dispatch(
      updateRecords({ index: recordsDB.length - 1, records: recordsDB })
    );
  }, [recordsDB]);

  useEffect(() => {
    if (!records.length) return;
    setColor(records[index].state.color);
    setTitle(records[index].state.title);
  }, [records, index]);

  return (
    <div
      style={{ backgroundColor: color }}
      className="w-screen h-screen flex flex-col"
    >
      <div className="w-screen h-auto py-5 px-10 bg-white shadow-lg flex flex-row-reverse">
        <Button
          onClick={() => {
            const state: State = { color, title };
            const record: Record = { created_at: new Date(), state };
            dispatch(
              addRecord({ created_at: new Date(), state: { color, title } })
            );
            fetch("/api/records/save", {
              method: "POST",
              body: JSON.stringify(record),
            });
          }}
        >
          Save
        </Button>
        <div className="relative mr-5">
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Restore
          </Button>
          <div className="left-1/2 absolute w-56 mt-5 -translate-x-1/2">
            {open &&
              records.map((record) => (
                <div className="bg-white p-3 flex flex-col break-all shadow-xl">
                  <p>{record.state.color}</p>
                  <p>{record.state.title}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-screen flex flex-col flex-1 items-center justify-evenly">
        <div className="w-auto h-auto p-5 bg-white shadow-lg rounded-lg">
          <h1 className="font-mono font-bold text-4xl">
            {title || "Welcome back, try typing you name..."}
          </h1>
        </div>
        <ColorPicker color={color} onChange={setColor} />
        <div className="w-auto h-auto bg-white p-3 rounded-lg shadow-md">
          <TextField
            id="standard-basic"
            label="Standard"
            variant="standard"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const response = await fetch("http://localhost:3001/api/records/get");
  const recordsDB: Record[] = await response.json();

  return {
    props: { recordsDB },
  };
}

export default Home;