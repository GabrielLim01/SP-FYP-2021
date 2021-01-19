import React from 'react'
import { Route } from 'react-router-dom';
import { inProduction, adminAccountType } from '../common.js';

class ProtectedRoute extends React.Component {
    render() {
        let isAuthenticated = false;
        let requiresAdmin = false;
        let isAdmin = false;

        if (this.props.adminOnly) {
            requiresAdmin = true;
        }

        if (inProduction) {
            isAuthenticated = true;
            isAdmin = true;
        }
        else if (sessionStorage.getItem("user") !== null) {
            isAuthenticated = true;

            if (requiresAdmin) {
                let user = JSON.parse(sessionStorage.getItem("user"));

                if (user.accountType === adminAccountType) {
                    isAdmin = true;
                }
            }
        }

        if (isAuthenticated) {
            if (requiresAdmin) {
                if (isAdmin) {
                    return <Route component={this.props.component} />
                } else {
                    return <h1>401 Unauthorized</h1>
                }
            } else {
                return <Route component={this.props.component} />
            }
        } else {
            return <h1>403 Forbidden</h1>
        }
    }
}

export default ProtectedRoute;