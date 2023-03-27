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
import Popup from "../Common/Popup";
import { useSearchParams } from "react-router-dom";

export default function FriendSchedule() {
  const { getAccessTokenSilently } = useAuth0();
  const [is_private, setIsPrivate] = useState(false);
  const [event_tags, setEventTags] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [modalDescription, setModalDescription] = useState(false);

  const [mappedEvents, setMappedEvents] = useState([]);

  const api = new Api();

  const[searchparams] = useSearchParams();

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    return (
      <AppointmentForm.BasicLayout
        readOnly={true}
        appointmentData={appointmentData}
        {...restProps}
      >
        <AppointmentForm.Label text="Description" type="title" />
      </AppointmentForm.BasicLayout>
    );
  };

  //TODO
  const TimeTableCell = React.useCallback(React.memo(({ onDoubleClick, ...restProps }) => (
    <WeekView.TimeTableCell
      {...restProps}
      onDoubleClick={undefined} // disable creating event through double clicking 
    />
  )), [false]);

  // disable deleting an event
  const CommandButton = React.useCallback(({ id, ...restProps }) => {
    if (id === 'deleteButton') {
      return <AppointmentForm.CommandButton id={id} {...restProps} disabled={true} />;
    }
    return <AppointmentForm.CommandButton id={id} {...restProps} />;
  }, [false]);

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
    await api.getFriendsEvents(await getAccessTokenSilently(), searchparams.get("friend")).then((res) => {
      setEvents(res.events);
    });
  }

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
          <EditingState/>
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
          <WeekView
            timeTableCellComponent={TimeTableCell}
          />
          <Appointments />
          <AppointmentTooltip showDeleteButton={false} showOpenButton />
          <AppointmentForm
            readOnly={true} //disable editing an event 
          />
          <AllDayPanel />
        </Scheduler>
      </Paper>
    </div>
  );
}