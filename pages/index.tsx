const Home = () => {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-5 w-36">
        <img src="mixi-logo.png" alt="mixi logo" className="w-36" />
        <a href="/" className=" no-underline">
          <h1 className="text-5xl font-bold">Mixi</h1>
        </a>
      </div>
      <p className="mb-4 text-xl">
        Make mixes faster by sorting your Spotify playlist tracks by key and
        BPM!
      </p>
      <a href="/" className="mb-4">
        <button
          className="bg-green-500 px-4 py-2 text-sm text-white"
          type="button"
        >
          Access with Spotify
        </button>
      </a>
      <p>
        built by{' '}
        <a
          href="https://github.com/mg2239"
          target="_blank"
          rel="noopener noreferrer"
        >
          matt
        </a>{' '}
        on github
      </p>
      {/* {token && <PlaylistInput accessToken={token} />} */}
    </div>
  );
};

export default Home;
