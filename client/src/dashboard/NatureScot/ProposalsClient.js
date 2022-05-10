import { SubClient } from 'api-client/SubClient';

export class ProposalsClient extends SubClient {
  constructor() {
    super('/proposals');
  }

  async getProposals() {
    const response = await this.makeAuthenticatedRequest('/');
    return response.json();
  }

  async saveProposal(proposal) {
    const formData = new FormData();
    Object.keys(proposal).forEach(key => formData.append(key, proposal[key]));
    // nested JSON should be stringified prior to passing to backend
    formData.set('geometry', JSON.stringify(proposal['geometry']));
    formData.set(
      'proposal_activities',
      JSON.stringify(proposal['proposal_activities']),
    );
    formData.set('report_state', JSON.stringify(proposal['report_state']));
    const response = await this.makeAuthenticatedRequest('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body: formData,
    });

    return response.json();
  }

  async updateProposal(proposal) {
    const formData = new FormData();
    Object.keys(proposal).forEach(key => formData.set(key, proposal[key]));
    formData.set('geometry', JSON.stringify(proposal['geometry']));
    formData.set(
      'proposal_activities',
      JSON.stringify(proposal['proposal_activities']),
    );
    formData.set('report_state', JSON.stringify(proposal['report_state']));
    const response = await this.makeAuthenticatedRequest(`/${proposal.id}/`, {
      method: 'PUT',
      body: formData,
    });

    const result = response.json();

    return result;
  }

  async deleteProposal(proposalId) {
    return await this.makeAuthenticatedRequest(`/${proposalId}/`, {
      method: 'DELETE',
    });
  }
}
