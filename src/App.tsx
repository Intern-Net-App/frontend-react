import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Job {
  ID: string;
  JobTitle: string;
  CompanyName: string;
  CompanyLocation: string;
  CompanyLink: string;
  JobDetailUrl: string;
  JobListed: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/jobs?skip=${(page - 1) * 3}&limit=10`);
      const newJobs: Job[] = response.data;
      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      setPage(page + 3);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!loading) {
      const options = {
        threshold: 0.6,
      };
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchJobs();
          }
        },
        options
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, [loading]);

  return (
    <main style={{marginLeft: '20px'}}>
      <h1>Job Postings</h1>
      <div>
        {jobs.map((job) => (
          <div key={job.ID}>
            <h2>{job.JobTitle}</h2>
            <p>{job.CompanyName}</p>
            <p>{job.CompanyLocation}</p>
            <a href={job.JobDetailUrl} target='_blank'>Job Details</a>
          </div>
        ))}
      </div>
      <div ref={containerRef} style={{ height: '20px' }}>
        {loading && <p>Loading...</p>}
      </div>
    </main>
  );
}

export default App;
