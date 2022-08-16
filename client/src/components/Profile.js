import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Profile.css";

const Profile = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [payloadInfo, setPayloadInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);
  const [runawayInfo, setRunawayInfo] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fecthUserInfo();
  }, [token]);

  const fecthUserInfo = async () => {
    const settings = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (token) {
        const payload = await axios("/auth/profile", settings);
        setPayloadInfo(payload.data);
        const user = await axios(`/users/${payload.data.id}`, settings);
        setUserInfo(user.data);

        //get specific data if is host or runaway
        const typeOfUser = payloadInfo.isHost ? "hosts" : "runaways";
        const { data } = await axios(
          `/${typeOfUser}/${
            payloadInfo.isHost ? payloadInfo.host_id : payloadInfo.runaway_id
          }`,
          settings
        );

        payloadInfo.isHost ? setHostInfo(data) : setRunawayInfo(data);
      } else {
        console.log("No user logged in yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      {userInfo && (
        <div>
          <div className="card mx-auto mt-3" style={{ width: 20 + "rem" }}>
            <div className="card-header bg-info">Account Information</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Username: {userInfo.username}</li>
              <li className="list-group-item">Email: {userInfo.email}</li>
            </ul>
          </div>
          <div
            class="accordion mx-auto mt-3"
            style={{ width: 40 + "rem" }}
            id="accordionPanelsStayOpenExample"
          >
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Personal Information
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div class="accordion-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Name: {userInfo.name} </li>
                    <li className="list-group-item">
                      Surname: {userInfo.surname}{" "}
                    </li>
                    <li className="list-group-item">
                      Birthday: {userInfo.birthday}{" "}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {hostInfo && (
              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    Hosting Information
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  class="accordion-collapse collapse"
                  aria-labelledby="panelsStayOpen-headingTwo"
                >
                  <div class="accordion-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Location: {hostInfo.location}{" "}
                      </li>
                      {/* here we could show buttons redirecting to each room they own */}
                      <li className="list-group-item">
                        Number of rooms available: {hostInfo.num_rooms}{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {runawayInfo && (
              <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseThree"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseThree"
                  >
                    Runaway Information
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseThree"
                  class="accordion-collapse collapse"
                  aria-labelledby="panelsStayOpen-headingThree"
                >
                  <div class="accordion-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Do you need a room asap?{" "}
                        {runawayInfo.need_room_asap ? "Yes" : "No"}{" "}
                      </li>
                      <li className="list-group-item">
                        You are running away because: {runawayInfo.why_running}{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
