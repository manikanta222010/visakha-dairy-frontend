import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import './css/notFound.css'

export function NotFound() {

    return (
        <section className='notFound'>
            <h1>404 - Page Not Found</h1>
            <section class="error-container">
                <span class="four"><span class="screen-reader-text">4</span></span>
                <span class="zero"><span class="screen-reader-text">0</span></span>
                <span class="four"><span class="screen-reader-text">4</span></span>
            </section>
            <div class="link-container">
                <Link to="/home" className="more-link">Go to Home &#x21e8;</Link>
            </div>
        </section>
    );
}
