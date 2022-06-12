import { FC, useEffect, useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Record, RecordFromSSR, State } from "../shared";
import {
  addRecord,
  selectRecord,
  updateRecords,
} from "../src/slices/records.slice";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";
import { GetServerSideProps } from "next";
import { prisma } from "../prisma";

interface RecordsSSR {
  recordsDB: RecordFromSSR[];
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
              addRecord({
                created_at: new Date().toISOString(),
                state: { color, title },
              })
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
          <div className="left-1/2 z-50 absolute w-80 mt-5 max-h-96 overflow-y-auto -translate-x-1/2">
            {open &&
              records.map((record, index) => (
                <div
                  onClick={() => {
                    dispatch(selectRecord(index));
                    setOpen(false);
                  }}
                  className="bg-white hover:cursor-pointer hover:border-2 border-black p-3 flex flex-col shadow-xl"
                >
                  <p>Color: {record.state.color}</p>
                  <p>Header: {record.state.title}</p>
                  <hr />
                  <p className="text-xs pt-1 text-slate-500">
                    edited at: {new Date(record.created_at).toLocaleString()}
                  </p>
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
            label="Try writing something"
            variant="standard"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const recordsDB = await prisma.record.findMany({});

    console.log({ recordsDB });

    const serializedRecords = recordsDB.map((r) => ({
      state: JSON.parse(r.state) as State,
      created_at: r.created_at.toISOString(),
    }));

    if (!serializedRecords.length)
      serializedRecords.push({
        created_at: new Date().toISOString(),
        state: { color: "#574888", title: "Welcome back !" },
      });

    return {
      props: {
        recordsDB: serializedRecords,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        recordsDB: [
          {
            created_at: new Date().toISOString(),
            state: JSON.stringify({
              color: "#574888",
              title: "Welcome back !",
            }),
          },
        ],
      },
    };
  }
};

export default Home;
