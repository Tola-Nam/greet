import React from "react";

function UserProfile() {
    
    const name = "srey nich";
    const age = 22;
    const isAdmin = true;

    return (
        <div className="profile">
            <h1 className="text-blue-400 text-2xl">Hello, {name}.</h1>
            <p className="text-blue-400 text-2xl">Age: {age}</p>
            <p className="text-blue-400 text-2xl">
                Is Admin: {isAdmin && "AdminUser"}
            </p>
        </div>
    );
}

export default UserProfile;
