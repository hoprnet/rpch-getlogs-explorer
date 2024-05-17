{ pkgs ? import <nixpkgs> {}, ... }:
let
  linuxPkgs = with pkgs; lib.optional stdenv.isLinux (
    inotifyTools
  );
  macosPkgs = with pkgs; lib.optional stdenv.isDarwin (
    with darwin.apple_sdk.frameworks; [
      # macOS file watcher support
      CoreFoundation
      CoreServices
    ]
  );
in
with pkgs;
mkShell {
  buildInputs = [
    envsubst
    nodejs_20
    (yarn.override { nodejs = nodejs_20; })
    macosPkgs
    linuxPkgs
  ];
}
