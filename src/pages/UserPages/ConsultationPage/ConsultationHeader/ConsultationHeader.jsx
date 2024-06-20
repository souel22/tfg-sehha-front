import React from 'react';
import './ConsultationHeader.css';

const ConsultationHeader = ({ specialty, doctorName }) => (
  <div className="consultation-header">
    {specialty} Appointment with Dr. {doctorName}
  </div>
);

export default ConsultationHeader;
