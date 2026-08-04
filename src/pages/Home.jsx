import { useAuth } from "../features/auth/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Promotional Program System
      </h1>

      <p className="mt-4">
        {user
          ? `Logged in as ${user.email}`
          : "No user is currently logged in."}
      </p>
    </div>
  );
}

export default Home;