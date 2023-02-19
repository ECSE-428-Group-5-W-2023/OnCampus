import { useEffect, useState } from "react";

import Api from "../../helpers/api";
import Button from "../Common/Button";
import { useAuth0 } from "@auth0/auth0-react";
export default function Schedule() {
  
  let emptyDaysOfWeek = ["","","","","","",""];
  
  const { getAccessTokenSilently } = useAuth0();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [is_recurring, setIsRecurring] = useState(false); 
  const [is_private, setIsPrivate] = useState(false); 
  const [days_of_week, setDaysOfWeek] = useState(emptyDaysOfWeek); 
  const [event_frequency, setEventFrequency] = useState("Once"); 
  const [event_tags, setEventTags] = useState([]);
  const [date, setDate] = useState("dateA"); 
  const [end_period, setEndPeriod] = useState("endPeriod");
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

  //Updating the is_recurring boolean when the checkbox is clicked
  function handleRecurringChange(e){
    setIsRecurring(e.target.checked); 
  }

  //Updating the is_recurring boolean when the checkbox is clicked
  function handleVisibilityChange(e){
    setIsPrivate(e.target.checked); 
  }

  async function createEvent(event) {
    event.preventDefault(); //prevent page refresh

    //create even with specified title and description, set start time to now and end time to 1 hour from now (can be changed once we have interface to pick those)
    await api
      .createEvent(
        await getAccessTokenSilently(),
        title,
        description,
        is_recurring,
        is_private,
        days_of_week,
        event_frequency,
        event_tags,
        date, 
        end_period,
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

          <div className="flex flex-col mb-10 mr-4">
          <label className="text-white  text-sm font-bold mb-1">Recurring</label>
          <input type="checkbox" checked={is_recurring} name="eventType" onChange={handleRecurringChange} ></input>
          </div>

          <div className="flex flex-col mb-10 mr-4">
          <label className="text-white  text-sm font-bold mb-1">Private</label>
          <input type="checkbox" checked={is_private} name="visibilityType" onChange={handleVisibilityChange} ></input>
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
                  {event.days_of_week}
                  <br />
                  {event.event_frequency}
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
