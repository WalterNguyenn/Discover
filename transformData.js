// Transform Spotify track data
const transformTrack = (spotifyTrack) => ({
    spotifyId: spotifyTrack.id,
    name: spotifyTrack.name,
    album: {
      name: spotifyTrack.album.name,
      album_type: spotifyTrack.album.album_type,
      external_urls: spotifyTrack.album.external_urls,
      images: spotifyTrack.album.images,
      release_date: spotifyTrack.album.release_date,
      uri: spotifyTrack.album.uri,
    },
    artists: spotifyTrack.artists.map(artist => ({
      name: artist.name,
      spotifyId: artist.id,
      external_urls: artist.external_urls,
    })),
    duration_ms: spotifyTrack.duration_ms,
    explicit: spotifyTrack.explicit,
    popularity: spotifyTrack.popularity,
    external_url: spotifyTrack.external_urls.spotify,
    preview_url: spotifyTrack.preview_url,
    uri: spotifyTrack.uri,
  });
  
  // Transform Spotify playlist data
  const transformPlaylist = (spotifyPlaylist) => ({
    playlistId: spotifyPlaylist.id,
    name: spotifyPlaylist.name,
    tracks: spotifyPlaylist.tracks.href,
    uri: spotifyPlaylist.uri,
  });
  
  // Transform Spotify artist data
  const transformArtist = (spotifyArtist) => ({
    spotifyId: spotifyArtist.id,
    name: spotifyArtist.name,
    genres: spotifyArtist.genres,
    popularity: spotifyArtist.popularity,
    uri: spotifyArtist.uri,
  });
  
  module.exports = { transformTrack, transformPlaylist, transformArtist };
  