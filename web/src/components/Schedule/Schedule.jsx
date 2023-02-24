import { useEffect, useState } from "react";

import Api from "../../helpers/api";
import Button from "../Common/Button";
import { useAuth0 } from "@auth0/auth0-react";



// SCHEDULELR IMPORTS AND ALL
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, IntegratedEditing, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    ConfirmationDialog,
    Appointments,
    Toolbar,
    WeekView,
    DateNavigator,
    AppointmentTooltip,
    AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';

export default function Schedule() {
    //ORIGINAL VARIABLES FOR CREATE EVENT 
    const { getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [events, setEvents] = useState([]);
    const [mappedEvents, setMappedEvents] = useState([]);

    const api = new Api();

    useEffect(() => {
        try {
            getAllEvents();
        } catch (err) {
            console.log("error" + err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMappedEvents(mapEvents); //map to another form that can be read by react scheduler
    }, [events]);
    
    async function getAllEvents() {
        const token = await getAccessTokenSilently();
        const res = await api.getEvents(token);
        console.log(res);
        setEvents(res.events);
    }

    
    //   async function createEvent(event) {    //ORIGINAL CODE TO CREATE EVENT 
    //     event.preventDefault(); //prevent page refresh

    //     //create even with specified title and description, set start time to now and end time to 1 hour from now (can be changed once we have interface to pick those)
    //     await api
    //       .createEvent(
    //         await getAccessTokenSilently(),
    //         title,
    //         description,
    //         startDate,
    //         endDate 
    //       )
    //       .then((res) => {
    //         console.log(res);
    //         setEvents(res.message);
    //       });

    //     //refresh events
    //     getAllEvents();
    //     }


    //IMPLEMENT CREATE/EDIT/DELETE EVENT HERE
    const commitChanges = ({ added, changed, deleted }) => {
        if (added) {
            //CREATE EVENT
            console.log("CREATED");
        }
        if (changed) {
            //EDIT EVENT
            console.log("CHANGED");
        }
        if (deleted !== undefined) {
            //DELETE EVENT
            console.log("DELETED");
        }
        //refresh events
        getAllEvents();
    };



    function mapEvents() {
        const mapped = events.map(value => ({
            startDate: value.start_date,
            endDate: value.end_date,
            title: value.title,
            id: value.id,
            //rRule: value.isReccuring,     TODO: once create recurring event is implemented
            //endPeriod: value.
            //description and event_list_id are not mapped
        }))
        return mapped;
    }


    return (
        <div>
            <Paper>
                <Scheduler
                    data={mappedEvents}
                    height={750}
                >
                    <EditingState
                        onCommitChanges={commitChanges}
                    />
                    <ViewState
                        defaultCurrentDate="2023-02-05"
                    />
                    <WeekView
                        startDayHour={6}
                        endDayHour={24}
                    />
                    <IntegratedEditing />
                    <Toolbar />
                    <DateNavigator />
                    <ConfirmationDialog />
                    <Appointments />
                    <AppointmentTooltip
                        showDeleteButton
                        showOpenButton
                    />
                    <AppointmentForm />
                </Scheduler>
            </Paper>




            {/* ORIGINAL CONTENT FROM MAIN BRANCH

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
            <label className="text-white  text-sm font-bold mb-1">
              Description
            </label>
            <input
              type="text"
              className="border rounded py-1 px-2 leading-tight focus:outline-none focus:border-stone-500"
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
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
                  {start_date}
                  <br />
                  {end_date}
                </div>
              }
            </li>
          );
        })} END OF MAIN BRANCH */}


        </div>
    );
}
