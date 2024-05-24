{
  description = "RPCh GetLogs Explorer";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/23.11";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.simpleFlake {
      inherit self nixpkgs;
      name = "getlogsex";
      systems = [ "x86_64-linux" "aarch64-darwin" "x86_64-darwin" ];
      shell = { pkgs ? import <nixpkgs> }:
        pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            (yarn.override { nodejs = nodejs_20; })
            nixfmt
          ];
        };
    };
}
