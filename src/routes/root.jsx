import { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => { 
    document.getElementById("q").value = q;
  }, [q]);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <div id="sidebar">
        <h2>ReachMe Contacts</h2>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <div style={{ flexDirection: "row", display: "flex" }}>
                        <h4>
                          {contact.first} {contact.last}
                        </h4>
                      </div>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>

        <hr style={{ margin: '20px 0', backgroundColor: 'white', height: '1px', border: 'none' }} />

        <div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <h2>***Liste des utilisateurs de Back***</h2>
            {users.map(user => (
              <li key={user._id} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                <div onClick={() => handleUserClick(user)}>
                  {user.name} {user.lastname}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        {selectedUser ? (
          <div>
            <h1>Contact information</h1>
            <p><strong>Nom:</strong> {selectedUser.name}</p>
            <p><strong>Prénom:</strong> {selectedUser.lastname}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Téléphone:</strong> {selectedUser.telephone_number}</p>
            <p><strong>Notes:</strong> {selectedUser.notes}</p>
            <img src={selectedUser.image} style={{ width: '200px', height: '200px' }} />
          </div>
        ) : ( 
          <p></p>
        )}
        <Outlet />
      </div>
    </>
  );
}
