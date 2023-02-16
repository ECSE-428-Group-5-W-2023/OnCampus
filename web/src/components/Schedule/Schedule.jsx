import React from "react";
import './Schedule.css';

export default function Schedule(){
    return (
        <div class="calendar">
            <div class="header">
                <ul class = "weekdays">
                    <li>Sunday</li>
                    <li>Monday</li>
                    <li>Tuesday</li>
                    <li>Wednesday</li>
                    <li>Thursday</li>
                    <li>Friday</li>
                    <li>Saturday</li>
                </ul>

                <ul class = "dates">
                    <li>Feb 5</li>
                    <li>Feb 6</li>
                    <li>Feb 7</li>
                    <li>Feb 8</li>
                    <li>Feb 9</li>
                    <li>Feb 10</li>
                    <li>Feb 11</li>
                </ul>
            </div>

            <div class = "time">
                <ul>
                    <li>7:00</li>
                    <li>7:30</li>
                    <li>8:00</li>
                    <li>8:30</li>
                    <li>9:00</li>
                    <li>9:30</li>
                    <li>10:00</li>
                    <li>10:30</li>
                    <li>11:00</li>
                    <li>11:30</li>
                    <li>12:00</li>
                    <li>12:30</li>
                    <li>13:00</li>
                    <li>13:30</li>
                    <li>14:00</li>
                    <li>14:30</li>
                    <li>15:00</li>
                    <li>15:30</li>
                    <li>16:00</li>
                    <li>16:30</li>
                    <li>17:00</li>
                    <li>17:30</li>
                    <li>18:00</li>
                    <li>18:30</li>
                    <li>19:00</li>
                    <li>19:30</li>
                    <li>20:00</li>
                </ul>
            </div>
            <div class="event-container">

                <div class="event" id="event1">
                    <span>ecse428</span>
                    <p>6pm-8pm</p>
                </div>

            </div>
        </div>
    )
}