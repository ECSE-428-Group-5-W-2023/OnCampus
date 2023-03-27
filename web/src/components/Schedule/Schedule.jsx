import { useEffect, useState } from "react";
import Api from "../../helpers/api";
import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  IntegratedEditing,
  EditingState} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  ConfirmationDialog,
  Appointments,
  Toolbar,
  WeekView,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  AppointmentFormProps,
  AllDayPanel,
  Resources,
  MonthView,
  EditRecurrenceMenu,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import Popup from "../Common/Popup";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function Schedule() {
  const { getAccessTokenSilently } = useAuth0();
  const [is_private, setIsPrivate] = useState(false);
  const [event_tags, setEventTags] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [modalDescription, setModalDescription] = useState(false);

  const [mappedEvents, setMappedEvents] = useState([]);
  
  const api = new Api();

  const TextEditor = (props) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === "multilineTextEditor") {
      return null;
    }
    return <AppointmentForm.TextEditor {...props} />;
  };

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({ description: nextValue });
    };

    const handleChange = (nextValue) => {
      setEventTags(nextValue.target.value);
    };

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.Label text="Description" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.description}
          onValueChange={onCustomFieldChange}
          placeholder="Add description"
        />

        <AppointmentForm.Label text="Tag" type="title" />
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tag</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={event_tags}
              label="Tag"
              onChange={handleChange}
            >
              <MenuItem value={10}>Class</MenuItem>
              <MenuItem value={20}>Work</MenuItem>
              <MenuItem value={30}>Meeting</MenuItem>
              <MenuItem value={40}>Study</MenuItem>
              <MenuItem value={50}>Personal</MenuItem>
            </Select>
          </FormControl>
        </Box>
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

  async function createEvent(
    title,
    description,
    event_tags,
    rRule,
    exDate,
    allDay,
    startDate,
    endDate
  ) {
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
    event_tags,
    rRule,
    exDate,
    allDay,
    startDate,
    endDate
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

  //delete event with specified id
  async function deleteEvent(id) {
    api.deleteEvent(await getAccessTokenSilently(), id).then(() => {
      getAllEvents();
    });
  }

  async function incorrectDates() {
    setModalTitle("Start date after end date");
    setModalDescription(
      "It looks like your start date was set to a time after your end date. Fix and try again"
    );
    setShowModal(true);
  }

  //IMPLEMENT CREATE/EDIT/DELETE EVENT HERE
  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      if (added.startDate > added.endDate) {
        incorrectDates();
        return;
      }
      createEvent(
        added.title,
        added.description,
        added.event_tags,
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

      if (changes.startDate > changes.endDate) {
        incorrectDates();
        return;
      }
      editEvent(
        id,
        changes.title,
        changes.description,
        changes.event_tags,
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
      deleteEvent(deleted);
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
      event_tags: value.event_tags,
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
          <Popup
            open={showModal}
            setOpen={setShowModal}
            title={modalTitle}
            description={modalDescription}
          />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showDeleteButton showOpenButton />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
          />
          <AllDayPanel />
        </Scheduler>
      </Paper>
    </div>
  );
}
