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
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [modalDescription, setModalDescription] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [modalPopupTitle, setModalPopupTitle] = useState(false);
  const [modalPopupDescription, setModalPopupDescription] = useState(false);

  const [mappedEvents, setMappedEvents] = useState([]);

  const api = new Api();

  const [searchparams] = useSearchParams();

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

  const TimeTableCell = React.useCallback(
    React.memo(({ onDoubleClick, ...restProps }) => (
      <WeekView.TimeTableCell
        {...restProps}
        onDoubleClick={undefined} // disable creating event through double clicking
      />
    )),
    [false]
  );

  // disable deleting an event
  const CommandButton = React.useCallback(
    ({ id, ...restProps }) => {
      if (id === "deleteButton") {
        return (
          <AppointmentForm.CommandButton
            id={id}
            {...restProps}
            disabled={true}
          />
        );
      }
      return <AppointmentForm.CommandButton id={id} {...restProps} />;
    },
    [false]
  );

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

  async function friendshipDoesNotExist() {
    setModalPopupTitle("You are not friends!");
    setModalPopupDescription("You have not added this person as a friend.");
    setShowPopupModal(true);
  }

  async function getAllEvents() {
    await api
      .getFriendsEvents(
        await getAccessTokenSilently(),
        searchparams.get("friend")
      )
      .then((res) => {
        console.log(res);
        if (res.message == "Friendship does not exist") {
          friendshipDoesNotExist();
          console.log("friendship does not exist!");
        } else {
          setEvents(res.events);
        }
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
    }));
    return mapped;
  }

  return (
    <div>
      <Paper>
        <Scheduler data={mappedEvents} height={750}>
          <EditingState />
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
          <Popup
            open={showPopupModal}
            setOpen={setShowPopupModal}
            title={modalPopupTitle}
            description={modalPopupDescription}
          />
          <ConfirmationDialog />
          <WeekView timeTableCellComponent={TimeTableCell} />
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
