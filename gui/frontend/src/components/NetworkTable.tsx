import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Switch,
  Grid,
} from "@mui/material";
import { useCallback } from "react";
import {Link, useNavigate} from "react-router-dom";
import { main } from "../../wailsjs/go/models";
import { getNetworkDetailsPageUrl } from "../utils/networks";
import {GoPullLatestNodeConfig} from "../../wailsjs/go/main/App";
import {AppRoutes} from "../routes";

interface NetworkTableProps {
  networks: main.Network[];
  onNetworkStatusChange: (networkName: string, newStatus: boolean) => void;
  emptyMsg?: string;
}

export default function NetworkTable(props: NetworkTableProps) {
  const getNetworkLink = useCallback((network: main.Network) => {
    return getNetworkDetailsPageUrl(network?.node?.network ?? '');
  }, []);

  const onPullClick = useCallback(async (network: main.Network) => {
    try {
      await GoPullLatestNodeConfig(network?.node?.network ?? '')
    } catch (err) {
      console.error(err);
    } finally {
      useNavigate()(AppRoutes.NETWORKS_ROUTE);
    }
  }, []);

  return (
    <>
      {props?.networks?.length > 0 ? (
        <TableContainer component={Paper} style={{ width: '80vw'}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Network</TableCell>
                <TableCell align="right">Connect/Disconnect</TableCell>
                <TableCell align="center">Operate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.networks.map((nw, i) => (
                <TableRow key={(nw?.node?.network ?? '') + i} data-testid="network-row">
                  <TableCell data-testid="network-name">
                    <Button
                      variant="text"
                      title="View details"
                      component={Link}
                      to={getNetworkLink(nw)}
                    >
                      {nw?.node?.network ?? 'n/a'}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      data-testid="status-toggle"
                      checked={nw?.node?.connected ?? false}
                      onChange={() =>
                        props.onNetworkStatusChange(nw?.node?.network ?? '', !nw?.node?.connected)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                        variant="contained"
                        onClick={() =>
                            onPullClick(nw)
                        }
                        data-testid="pull-network-btn"
                    >
                      Pull
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h4>{props.emptyMsg ? props.emptyMsg : "No networks found"}</h4>
          </Grid>
        </Grid>
      )}
    </>
  );
}
