{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodejs = pkgs.nodejs_20;
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs

            nodePackages.typescript
            nodePackages.typescript-language-server
            nodePackages.svelte-language-server
            nodePackages.eslint
            nodePackages.prettier
          ];
        };
      });
}
