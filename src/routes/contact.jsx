//import React from 'react';
import PropTypes from 'prop-types';
import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";


// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Ooops!! Not Found",
    });
  }
  return { contact };
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
          alt="Contact Avatar"
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.email && (
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </p>
        )}

        {contact.telephone && (
                <p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`tel:${contact.telephone}`}
                  >
                    {contact.telephone}
                  </a>
                </p>
              )}
        

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite =
    fetcher.formData && fetcher.formData.get("favorite") === "true"
      ? true
      : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

Favorite.propTypes = {
  contact: PropTypes.shape({
    favorite: PropTypes.bool.isRequired,
    first: PropTypes.string,
    last: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.number,
    notes: PropTypes.string,
  }).isRequired,
};
