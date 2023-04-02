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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faUpload,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Common/Button";
import Invite from "./Invite";

export default function Schedule() {
  const { getAccessTokenSilently } = useAuth0();
  const [is_private, setIsPrivate] = useState(false);
  const [event_tags, setEventTags] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [modalDescription, setModalDescription] = useState(false);
  const [friendGroups, setFriendGroups] = useState([]);
  const [mappedEvents, setMappedEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(-1);
  const [friendsToInvite, setFriendsToInvite] = useState([]);
  const api = new Api();

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups() {
    api.getFriendGroups(await getAccessTokenSilently()).then((res) => {
      setFriendGroups(res.profile);
    });
  }
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      // Process the file here
      var reader = new FileReader();
      reader.onload = function (e) {
        // Use reader.result
        const events = parseICalData(reader.result);
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          console.log(event);
          createEvent(
            event.summary,
            event.location,
            false,
            undefined,
            undefined,
            false,
            event.start,
            event.end
          );
        }
        setFile(null);
      };
      reader.readAsText(file);
      console.log(`Processing file: ${file.name}`);
    } else {
      console.log("Please select a file to upload");
    }
  };

  function parseICalData(data) {
    const events = [];
    const lines = data.split(/\r?\n/);

    let event = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(/^([A-Z]+)(;.+)?:(.*)$/);
      if (!matches) {
        continue;
      }

      const prop = matches[1];
      const value = matches[3];

      switch (prop) {
        case "BEGIN":
          if (value === "VEVENT") {
            event = {};
          }
          break;
        case "END":
          if (value === "VEVENT") {
            events.push(event);
            event = null;
          }
          break;
        case "UID":
          if (event) {
            event.uid = value;
          }
          break;
        case "SUMMARY":
          if (event) {
            event.summary = value;
          }
          break;
        case "DTSTART":
          if (event) {
            const year = value.slice(0, 4);
            const month = parseInt(value.slice(4, 6)) - 1;
            const day = value.slice(6, 8);
            const hour = value.slice(9, 11);
            const minute = value.slice(11, 13);
            const second = value.slice(13, 15);
            event.start = new Date(year, month, day, hour, minute, second);
          }
          break;
        case "DTEND":
          if (event) {
            const year = value.slice(0, 4);
            const month = parseInt(value.slice(4, 6)) - 1;
            const day = value.slice(6, 8);
            const hour = value.slice(9, 11);
            const minute = value.slice(11, 13);
            const second = value.slice(13, 15);
            event.end = new Date(year, month, day, hour, minute, second);
          }
          break;
        case "LOCATION":
          if (event) {
            event.location = value;
          }
          break;
        default:
          // Ignore any other properties
          break;
      }
    }

    return events;
  }

  const TextEditor = (props) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === "multilineTextEditor") {
      return null;
    }
    return <AppointmentForm.TextEditor {...props} />;
  };

  function inviteFriend(friend) {
    console.log("Trying to invite:", friend);
    if (!friendsToInvite.includes(friend))
      setFriendsToInvite([...friendsToInvite, friend]);
  }

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onDescriptionChange = (nextValue) => {
      onFieldChange({ description: nextValue });
    };
    const onIsPrivateChange = (nextValue) => {
      onFieldChange({ is_private: nextValue });
    };

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.BooleanEditor
          value={appointmentData.is_private}
          onValueChange={onIsPrivateChange}
          label="Private"
        />
        <div>
          {friendsToInvite?.map((friend) => {
            return (
              <div className="m-2 bg-slate-200 rounded w-fit p-2 ">
                {friend.name}
                <FontAwesomeIcon
                  icon={faClose}
                  onClick={() => {
                    setFriendsToInvite(
                      friendsToInvite.filter((f) => f !== friend)
                    );
                  }}
                  className="ml-2 cursor-pointer"
                />
              </div>
            );
          })}

          <Invite inviteFriend={inviteFriend} />
        </div>{" "}
        <AppointmentForm.Label text="Description" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.description}
          onValueChange={onDescriptionChange}
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
  }, [selectedGroupId]);

  useEffect(() => {
    setMappedEvents(mapEvents); //map to another form that can be read by react scheduler
  }, [events]);

  async function getAllEvents() {
    await api
      .getEvents(await getAccessTokenSilently(), selectedGroupId)
      .then((res) => {
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
    is_private,
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
        endDate,
        selectedGroupId
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
    is_private,
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
        added.is_private,
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
        changes.is_private,
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
      is_private: value.is_private,
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
      <div>
        <Button
          onClick={() => {
            getAllEvents();
            setSelectedGroupId(-1);
          }}
          className="mr-1 mb-1"
          selected={selectedGroupId === -1}
        >
          <FontAwesomeIcon icon={faUser} className="mr-1" />
          My Schedule
        </Button>
        {friendGroups?.map((friendGroup) => {
          return (
            <Button
              onClick={() => {
                setSelectedGroupId(friendGroup.id);
              }}
              className="mr-1 mb-1"
              selected={selectedGroupId === friendGroup.id}
            >
              <FontAwesomeIcon icon={faUserGroup} className="mr-1" />
              {friendGroup.name}
            </Button>
          );
        })}
      </div>
      <div className="h-3/4 flex">
        <Paper>
          <Scheduler data={mappedEvents}>
            <EditingState onCommitChanges={commitChanges} />
            <ViewState defaultCurrentDate={new Date().toLocaleDateString()} />
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
            ></AppointmentForm>
            <AllDayPanel />
          </Scheduler>
        </Paper>
      </div>

      <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-4 mt-2 ">
        <label
          for="file-upload"
          className="flex items-center justify-center w-full md:w-auto mb-3 md:mb-0"
        >
          <FontAwesomeIcon
            icon={faUpload}
            className="mx-2 hover:cursor-pointer bg-white  p-2 rounded"
          />
          <span className="text-white hover:cursor-pointer ">
            {file?.name ? file.name : "Choose ICS file to upload"}
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleFileUpload}
        >
          Upload and Process File
        </button>
      </div>
    </div>
  );
}
