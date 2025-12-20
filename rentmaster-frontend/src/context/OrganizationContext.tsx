import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization } from '../services/api/organizationApi';
import { organizationApi } from '../services/api/organizationApi';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  setCurrentOrganization: (org: Organization | null) => void;
  loadOrganizations: () => Promise<void>;
  switchOrganization: (orgId: number) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const storedOrgId = localStorage.getItem('currentOrganizationId');
    loadOrganizations().then(() => {
      if (storedOrgId) {
        organizationApi.getAll().then(orgs => {
          const org = orgs.find(o => o.id.toString() === storedOrgId);
          if (org) {
            setCurrentOrganizationState(org);
            applyWhiteLabeling(org);
          }
        });
      }
    });
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationApi.getAll();
      setOrganizations(orgs);
      
      // If no current org is set, use the first one
      if (!currentOrganization && orgs.length > 0) {
        const storedOrgId = localStorage.getItem('currentOrganizationId');
        const org = storedOrgId 
          ? orgs.find(o => o.id.toString() === storedOrgId) || orgs[0]
          : orgs[0];
        if (org) {
          setCurrentOrganizationState(org);
          localStorage.setItem('currentOrganizationId', org.id.toString());
          applyWhiteLabeling(org);
        }
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  };

  const setCurrentOrganization = (org: Organization | null) => {
    setCurrentOrganizationState(org);
    if (org) {
      localStorage.setItem('currentOrganizationId', org.id.toString());
      // Apply white-labeling
      applyWhiteLabeling(org);
    } else {
      localStorage.removeItem('currentOrganizationId');
    }
  };

  const switchOrganization = async (orgId: number) => {
    try {
      const org = await organizationApi.getById(orgId);
      setCurrentOrganization(org);
      // Reload page to apply white-labeling
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch organization:', error);
      throw error;
    }
  };

  const applyWhiteLabeling = (org: Organization) => {
    const root = document.documentElement;
    if (org.primaryColor) {
      root.style.setProperty('--primary-color', org.primaryColor);
    }
    if (org.secondaryColor) {
      root.style.setProperty('--secondary-color', org.secondaryColor);
    }
    if (org.logoUrl) {
      // Store logo URL for use in components
      root.style.setProperty('--logo-url', `url(${org.logoUrl})`);
    }
  };

  return (
    <OrganizationContext.Provider value={{
      currentOrganization,
      organizations,
      setCurrentOrganization,
      loadOrganizations,
      switchOrganization,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

