import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = () => {
  const { user } = useAuth0();
  const [username, setUsername] = useState("");

  return (
    <div>
        <img
            src={user?.picture}
            alt={`${user?.name}`}
            className="w-40 h-40 rounded-full mx-auto"
        />
        <div class="fullNameLabel">Name: {{this.oldClientFullName}}</div>
        <div className="text-white text-lg font-bold m-3">Email: {user?.email}</div>
    </div>
  );
};

export default UserProfile;