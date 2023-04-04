import React from "react";


class Likes extends React.Component{

    state = {
        likes: 0
    }

    handleClick = () => {
        this.setState({
            likes: this.state.likes + 1
        })
        editEvent(this.props.eventId, this.state.likes + 1)
    }

    render(){
        return(
        <div>
            <button onClick={this.handleClick}> {this.state.likes} 👍</button>
        </div>
        )
    }
    
    editEvent(
        id,
        title,
        description,
        is_private,
        rRule,
        exDate,
        allDay,
        startDate,
        endDate,
        like_count,
        dislike_count
      ) {
        api
          .editEvent(
            getAccessTokenSilently(),
            id,
            title,
            description,
            is_private,
            event_tags,
            rRule,
            exDate,
            allDay,
            startDate,
            endDate,
            like_count,
            dislike_count
          )
          .then((res) => {
            setEvents(res.events);
          });
    
        //refresh events
        getAllEvents();
      }
}

export default Likes




