//import React from 'react';
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom';
import { updateContact } from '../contacts';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name , value)
    // setContact((prevContact) => ({
    //   ...prevContact,
    //   [name]: value,
    // }));
  };
  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
          required
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Email</span>
        <input
          type="text"
          name="email"
          placeholder="example@example.com"
          defaultValue={contact?.email}
        />
      </label>
      <label>
        <span>Profile Picture</span>
        <input
          placeholder="https://example.com/profile-pic.jpg"
          aria-label="Profile Picture URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
  <span>Telephone Number</span>
  <PhoneInput
    country={'us'} 
    value={contact?.telephone}
    onChange={(phone) => {
      const event = { target: { name: 'telephone', value: phone } };
     
      handleInputChange(event); 
    }}
    inputProps={{
      name: 'telephone',
      required: true,
      autoFocus: true,
    }}
  />
</label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
