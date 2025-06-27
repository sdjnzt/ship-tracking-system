declare module 'leaflet' {
  export interface LatLngExpression {
    lat: number;
    lng: number;
  }
  
  export function latLngBounds(
    corner1: LatLngExpression | LatLngExpression[],
    corner2?: LatLngExpression
  ): any;

  export function icon(options: any): any;
  
  export namespace Marker {
    interface MarkerOptions {
      icon?: any;
    }
  }
  
  export class Marker {
    static prototype: {
      options: Marker.MarkerOptions;
    };
  }

  export default L;
}

declare module 'react-leaflet' {
  import { ReactNode } from 'react';
  import L from 'leaflet';

  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface TileLayerProps {
    attribution?: string;
    url: string;
  }

  export interface MarkerProps {
    position: [number, number];
    icon?: any;
    eventHandlers?: {
      click?: () => void;
    };
    children?: ReactNode;
  }

  export interface PopupProps {
    children?: ReactNode;
  }

  export interface PolylineProps {
    positions: [number, number][];
    pathOptions?: {
      color?: string;
      weight?: number;
      dashArray?: string;
      opacity?: number;
    };
    children?: ReactNode;
  }

  export interface CircleMarkerProps {
    center: [number, number];
    radius: number;
    pathOptions?: {
      color?: string;
      fillColor?: string;
      fillOpacity?: number;
      weight?: number;
    };
    children?: ReactNode;
  }

  export function MapContainer(props: MapContainerProps): JSX.Element;
  export function TileLayer(props: TileLayerProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
  export function Popup(props: PopupProps): JSX.Element;
  export function Polyline(props: PolylineProps): JSX.Element;
  export function CircleMarker(props: CircleMarkerProps): JSX.Element;
  export function useMap(): any;
} 