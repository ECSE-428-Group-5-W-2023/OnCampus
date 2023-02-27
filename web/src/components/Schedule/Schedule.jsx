import { useEffect, useState } from "react";
import Api from "../../helpers/api";
import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  IntegratedEditing,
  EditingState,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  ConfirmationDialog,
  Appointments,
  Toolbar,
  WeekView,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";

export default function Schedule() {
  const { getAccessTokenSilently } = useAuth0();
  const [is_private, setIsPrivate] = useState(false);
  const [event_tags, setEventTags] = useState([]);
  const [events, setEvents] = useState([]);

  const [mappedEvents, setMappedEvents] = useState([]);

  const api = new Api();

  const TextEditor = (props) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === 'multilineTextEditor') {
      return null;
    } return <AppointmentForm.TextEditor {...props} />;
  };

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({ description: nextValue });
    };

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.Label
          text="Description"
          type="title"
        />
        <AppointmentForm.TextEditor
          value={appointmentData.description}
          onValueChange={onCustomFieldChange}
          placeholder="Add description"
        />
      </AppointmentForm.BasicLayout>
    );
  };

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
    await api.getEvents(await getAccessTokenSilently()).then((res) => {
      setEvents(res.events);
    });
  }

  //Updating the is_private boolean when the checkbox is clicked
  function handleVisibilityChange(e) {
    setIsPrivate(e.target.checked);
  }

  async function createEvent(title, description, rRule, exDate, allDay, startDate, endDate) {
    //create even with specified title and description, set start time to now and end time to 1 hour from now (can be changed once we have interface to pick those)
    await api
      .createEvent(
        await getAccessTokenSilently(),
        title,
        description,
        is_private,
        event_tags,
        rRule,
        exDate,
        allDay,
        startDate,
        endDate
      )
      .then((res) => {
        setEvents(res.events);
      });

    getAllEvents();
  }

  async function editEvent(
    id,
    title,
    description,
    rRule,
    exDate,
    allDay,
    startDate,
    endDate,
  ) {
    await api
      .editEvent(
        await getAccessTokenSilently(),
        id,
        title,
        description,
        is_private,
        event_tags,
        rRule,
        exDate,
        allDay,
        startDate,
        endDate
      )
      .then((res) => {
        setEvents(res.events);
      });

    //refresh events
    getAllEvents();
  }

  //IMPLEMENT CREATE/EDIT/DELETE EVENT HERE
  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      createEvent(
        added.title,
        added.description,
        added.rRule,
        added.exDate,
        added.allDay,
        added.startDate,
        added.endDate
      );
      console.log("ADDED");
    }
    if (changed) {
      //EDIT EVENT
      const id = Object.keys(changed)[0];
      const changes = Object.values(changed)[0];
      editEvent(
        id,
        changes.title,
        changes.description,
        changes.rRule,
        changes.exDate,
        changes.allDay,
        changes.startDate,
        changes.endDate
      );
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
    const mapped = events?.map((value) => ({
      id: value.id,
      title: value.title,
      description: value.description,
      rRule: value.r_rule,
      exDate: value.ex_date,
      allDay: value.all_day,
      startDate: value.start_date,
      endDate: value.end_date,
      //rRule: value.isReccuring,     TODO: once create recurring event is implemented
      //endPeriod: value.
      //description and event_list_id are not mapped
    }));
    return mapped;
  }

  return (
    <div>
      <Paper>
        <Scheduler data={mappedEvents} height={750}>
          <EditingState onCommitChanges={commitChanges} />
          <ViewState defaultCurrentDate="2023-02-05" />
          <WeekView startDayHour={6} endDayHour={24} />
          <IntegratedEditing />
          <Toolbar />
          <DateNavigator />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showDeleteButton showOpenButton />
          <AppointmentForm 
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}/>
          <AllDayPanel />
        </Scheduler>
      </Paper>
    </div>
  );
}
