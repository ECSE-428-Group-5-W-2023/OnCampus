import { useEffect, useState } from "react";

import Api from "../../helpers/api";
import Button from "../Common/Button";
import { useAuth0 } from "@auth0/auth0-react";
export default function Schedule() {
  const { getAccessTokenSilently } = useAuth0();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [is_recurring, setIsRecurring] = useState(false); 
  const [events, setEvents] = useState([]);

  const api = new Api();

  useEffect(() => {
    try {
      getAllEvents();
    } catch (err) {
      console.log("error" + err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAllEvents() {
    api.getEvents(await getAccessTokenSilently()).then((res) => {
      setEvents(res.events);
    });
  }

  async function filterRadioButton() {
    var radioOutput = document.getElementsByName('eventType');

    if (radioOutput[0].checked && radioOutput[0].value === "true"){
      console.log("RECURRING EVENT");
      setIsRecurring(true); 
    }
    else {
      console.log("UNIQUE EVENT");
      setIsRecurring(false); 
    }
  }

  async function createEvent(event) {
    event.preventDefault(); //prevent page refresh

    //create even with specified title and description, set start time to now and end time to 1 hour from now (can be changed once we have interface to pick those)
    await api
      .createEvent(
        await getAccessTokenSilently(),
        title,
        description,
        await filterRadioButton(),
        is_recurring,
        new Date(Date.now()).toISOString(),
        new Date(Date.now() + 1000000 * 60 * 60).toISOString() // 1 hour from now
      )
      .then((res) => {
        console.log(res);
        setEvents(res.message);
      });

    //refresh events
    getAllEvents();
  }

  return (
    <div>
      <form onSubmit={createEvent}>
        <div className="flex">
          <div className="flex flex-col mb-2 mr-2">
            <label className="text-white  text-sm font-bold mb-1">Title</label>
            <input
              type="text"
              className="border rounded py-1 px-2 leading-tight focus:outline-none focus:border-stone-500"
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-white  text-sm font-bold mb-1">Description</label>
            <input
              type="text"
              className="border rounded py-1 px-2 leading-tight focus:outline-none focus:border-stone-500"
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="flex flex-col mb-6 mr-4">
          <label className="text-white  text-sm font-bold mb-1">Recurring</label>
          <input type="radio" id="isRecurring" name="eventType" value ="true" ></input>
          </div>

          <div className="flex flex-col mb-8 mr-4">
          <label className="text-white  text-sm font-bold mb-1">Unique</label>
          <input type="radio" id="isUnique" name="eventType" value = "false" ></input>
          </div>
        </div>

        <Button type="submit">Create Event</Button>
      </form>

      {events &&
        events.map((event, key) => {
          const start_date = new Date(event.start_date).toString();
          const end_date = new Date(event.end_date).toString();
          return (
            <li className="list-none" key={key}>
              {
                <div className="bg-slate-300 w-fit my-1 py-1 px-2 rounded ">
                  {event.title}
                  <br />
                  {event.description}
                  <br />
                  {event.is_recurring}
                  <br />
                  {start_date}
                  <br />
                  {end_date}
                </div>
              }
            </li>
          );
        })}
    </div>
  );
}
